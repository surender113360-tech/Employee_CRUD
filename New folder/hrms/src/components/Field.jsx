export default function Field({label,value,onChange,type="text",requried=false,...props}){
    return
    <label className="field">
        <span>{label}</span>
        <input type ={type} value={value ??''} onChange={e=>onChange(e.target.value)} requried ={requried}{...props}></input>
    </label>
}