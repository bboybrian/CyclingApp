https://uao365-my.sharepoint.com/:w:/r/personal/a1225127_adelaide_edu_au/_layouts/15/Doc.aspx?sourcedoc=%7BE85B5E56-09A8-47B6-BF34-1EB009D7DC89%7D&file=220815_TT_model_description.docx&action=default&mobileredirect=true&cid=f55e360a-8ede-43ce-a414-f886af8dccf7

https://uao365-my.sharepoint.com/:x:/r/personal/a1225127_adelaide_edu_au/_layouts/15/Doc.aspx?sourcedoc=%7BC51DFFE9-21B4-44EE-B0AB-7F19C91AB68A%7D&file=220815_outdoor_TT_model_v4_shared.xlsx&action=default&mobileredirect=true

Lookup course slope and bearing at that timestep (distance)

· Calculate relative wind angle

· Get the wind-speed at the ground. Note with a single terrain classification this will not be looked up

· Calculate the effective yaw angle

· Lookup power input and position based on location on the course

· Calculate power components for aero, rolling resistance and slope

· Net power = @Power_in-@Power_aero-@Power_roll-@Power_gravity

· Net propulsive force = net_power/speed

· Acceleration = F/m

· Calcs to update W’ balance

· **Move to next timestep**

· Calculate new velocity from v = u+at (u = vel from prev. timestep, t = dt)

· Calculate new distance from d2 = d1+(v*dt)

· …repeat until course distance has been completed