import "./dropdown.css"

const Dropdown = ({id, type, options, onChange}) => {

    const renderedOptions = options.map((value) => {
        return <option value={value.value}>{value.label}</option>
    })

    return <select id={id} className={type} onChange={onChange}>{renderedOptions}</select>
}

export default Dropdown;