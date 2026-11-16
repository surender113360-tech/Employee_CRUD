export default function Status({value}){
    const text =String(value||'unknow');
    return 
    <span className={`status ${text.toLowerCase()}`}>
        {text}

    </span>
}