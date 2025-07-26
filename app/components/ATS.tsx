
const ATS = ({score, suggestions}) => {
    console.log('suggestions:', suggestions);
  return (
    <div>
        {score} {suggestions.map((suggestion, index)=>(
        <p key={index}>{suggestion.tip}</p>
    ))}
    </div>
  )
}

export default ATS