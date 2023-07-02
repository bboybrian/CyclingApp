import gpxParser from "../../Map/GPXparser";

const pi = Math.PI;

function radians(degrees) { return degrees * (pi / 180); }
function degrees(radians) { return radians * (180 / pi); }

// From cda (at yaw 0), calculate cda for yaws 0 to 60
function yawCDA(cda) {
    let step02 = cda * 0.002
    let step13 = cda * 0.013
    let yawCDAs = [cda]
    for (let i = 0; i < 60; i++) {
        if (i < 5 || (i < 30 && i > 10)) {
        cda -= step02;
        } else if (i < 10) {
        cda -= step13;
        }
        yawCDAs.push(cda);
    }
    return yawCDAs;
}

// From cda_12, cda_14, cda_16, calculate cda for speeds 10-20, with yaws 0 to 60
function posCDA(cda12, cda14, cda16) {
    let posCDAs = {10: yawCDA(cda12),
                11: yawCDA(cda12), 
                12: yawCDA(cda12),
                13: yawCDA((cda12+cda14)/2),
                14: yawCDA(cda14),
                15: yawCDA((cda14+cda16)/2),
                16: yawCDA(cda16),
                17: yawCDA(cda16),
                18: yawCDA(cda16),
                19: yawCDA(cda16),
                20: yawCDA(cda16)};
    return posCDAs;
}

export const PredictionCalculations = (inputs, bike, user, course) => {
    
    // TODO - format course into useable format
    course = JSON.parse(course.gpx);
    var gpx = new gpxParser();
    gpx.parse(course);
    course = gpx.tracks[0];

    //course
    var slope_percents = [], slopes = [], elevation = [], bearings = [], roughness = [];
    const distances = [0].concat(course.distance.cumul);
    let L = distances.length - 1;
    for (let i = 0; i < L; i++) {
        bearings.push(course.points[i].bear);
        elevation.push(course.points[i].ele);
        roughness.push(course.points[i].rough);
        slopes.push(course.points[i].slope);
        slope_percents.push(course.points[i].slope_per);
    }

    // user inputs
    const delta_cda = inputs.delta_cda;
    const delta_watts = inputs.delta_watts;
    const delta_kg = inputs.delta_kg;
    const dt = inputs.dt;
    const wind_angle = inputs.wind_angle;
    const headwind = wind_angle - 180;
    const density = inputs.density;
    const v0 = inputs.v0;

    const steady_state = inputs.steady_state;
    const over_threshold = inputs.over_threshold;
    const descending = inputs.descending;

    const min_slope = inputs.min_slope;
    const max_slope = inputs.max_slope;
    const descending_slope = inputs.descending_slope;
    const climbing_slope = inputs.climbing_slope;

    //bike
    const crr = bike.crr;
    const mass_bike = bike.mass;
    const mech_eff = bike.mech_eff;
    const moi_front = bike.moi_whl_front;
    const moi_rear = bike.moi_whl_rear;
    const wheel_radius = bike.wheel_radius;

    // #region CALCULATE all_CDAs for bike
    let cda_12 = bike.cda_12;
    let cda_14 = bike.cda_14;
    let cda_16 = bike.cda_16;
    let cda_climb = bike.cda_climb;
    let cda_descend = bike.cda_descend;

    // // 3 positions, all speeds, 0 yaw
    let seated = posCDA(cda_12, cda_14, cda_16);
    let outriggers = posCDA(cda_12 + cda_climb, cda_14 + cda_climb, cda_16 + cda_climb);
    let supertuck = posCDA(cda_12 - cda_descend, cda_14 - cda_descend, cda_16 - cda_descend);

    var all_CDAs = {};
    all_CDAs["a"] = seated;
    all_CDAs["b"] = outriggers;
    all_CDAs["c"] = supertuck;
    // #endregion

    //user
    const cp = user.critical_power;
    const mass = user.mass;
    const mass_other = user.other_mass;
    const wprime = user.w_prime;
    const w_recovery_function = user.w_recovery;
    let wprime_ = wprime;

    const mass_total = mass + mass_bike + mass_other;

    var dists = [0.1];
    var speeds = [v0];
    var times = [0];

    let dist = dists[0];
    let speed = speeds[0];

    var km_hr = [speed * 3.6];

    const cda_lookup = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12];

    // Position at each point
    let positions = ['b'];
    for (let i = 1; i < L; i++) {
        if (slope_percents[i] < descending_slope) {
            positions.push('c');
        }
        else if (slope_percents[i] > climbing_slope) {
            positions.push('b');
        }
        else {
            positions.push('a');
        }
    }

    // Prediction for course.
    let i = 0
    var yaw_abs = [];
    var power_in = [];
    var cdas = [];
    var wprimes = [];

    while (i < L - 1) {
        // 1. Calculate Relative Wind Angle
        let rel_wind_angle = bearings[i] - headwind;

        // 2. Get the wind-speed at the ground with lookup tables.
        //               Class  |z0 length |mv   |m/sec
        // Race circuit  open	 2	        0.1	  1.0
        // Tree-lined,   light	 2.5	    0.2	  0.8
        // Tree-lined,   medium	 3	        0.4	  0.6
        // Tree-lined    dense	 3.5	    0.8   0.2

        // Segment	Roughness class		
        // 1	2		
        // 2	2.5		
        // 3	3		
        // 4	3.5		
        // 5	3.5		
        // 6	3.5		
        // 7	3		
        // 8	2.5		
        // 9	2		
        // For now we will just use a constant value '1'
        let wind_speed = 1;

        // 3. Calculate the effective yaw angle
        let effectiveYaw = degrees(Math.atan(wind_speed * Math.sin(radians(rel_wind_angle)) / (speed + wind_speed * Math.cos(radians(rel_wind_angle)))))
        yaw_abs.push(Math.abs(effectiveYaw));

        // 4. Lookup power input and position based on location on the course
        let slope = slopes[i];
        let power = mech_eff * cp;
        if (slope < min_slope) {
            power *= descending;
        } else if (slope > max_slope) {
            power *= over_threshold;
        } else {
            power *= steady_state;
        }
        power += delta_watts;
        power_in.push(power);

        let pos = positions[i]   // Where do 'segments' columns come from?

        // 5. Calculate power components for aero, rolling resistance and slope
        //=@Speed+@Wind_speed___1m*COS(RADIANS(@Relative_wind_angle)))^2+(@Wind_speed___1m*SIN(RADIANS(@Relative_wind_angle)
        let rel_wind_speed = Math.sqrt(
            Math.pow((speed + wind_speed * Math.cos(radians(rel_wind_angle))), 2) +
            Math.pow((wind_speed * Math.sin(radians(rel_wind_angle))), 2)
        );

        let cda = delta_cda + all_CDAs[pos][cda_lookup[Math.floor(rel_wind_speed)] + 8][Math.floor(Math.abs(effectiveYaw))];
        cdas.push(cda)

        let power_aero = 0.5 * density * Math.pow(rel_wind_speed, 3) * cda;
        let power_roll = mass_total * crr * 9.81 * speed;
        let power_gravity = slope * 9.81 * mass_total * speed;

        // 6. Net power = @Power_in-@Power_aero-@Power_roll-@Power_gravity
        let power_net = power - power_aero - power_roll - power_gravity;

        // 7. Net propulsive force = net_power/speed
        let propulsive_force = power_net / speed;

        // 8. Acceleration = F/m
        let accel = propulsive_force / (mass_total + (moi_front / Math.pow(wheel_radius, 2)) + (moi_rear / Math.pow(wheel_radius, 2)));

        // 9. Calcs to update W’ balance
        let DCp = Math.max(0, -(power / mech_eff - cp));
        // console.log("DCp:", DCp, power);

        // =IF((L3*(1/Mech_eff))*dt,0)
        let OT_energy = 0;
        if (power / mech_eff - cp > 0) {
            OT_energy = dt * power / mech_eff;
        }

        // Calculation for t'
        let tw = 0;
        if (w_recovery_function == 1) {
            tw = 2287.2 * Math.pow(DCp, -0.688);
        }
        else if (w_recovery_function == 2) {
            tw = wprime / DCp;
        }
        else if (w_recovery_function == 3) {
            tw = (546 * Math.exp(-0.01 * DCp)) + 316;
        }

        // Calculation for wprime
        // Excel formula: =IF(X2=0,AA1-Y2,wprime-(wprime-AA1)*EXP(-dt/Z2))
        if (DCp == 0) {
            wprime_ -= OT_energy;
        }
        else {
            wprime_ = wprime - (wprime - wprime_) * Math.exp((-dt) / tw);
        }
        wprimes.push(wprime_);

        // Update velocity and distance
        speed += accel * dt;
        dist += speed * dt;
        speeds.push(speed);
        km_hr.push(speed * 3.6);
        dists.push(dist);
        times.push(times[times.length - 1] + dt);


        // Increment i
        if (dist >= distances[i + 1]) { 
            i++; 
        }
    }

    const calculationResults = {
        dists,
        speeds,
        times,
        km_hr,
        elevation,
        yaw_abs,
        power_in,
        cdas,
        wprimes
    };

    return calculationResults;
}