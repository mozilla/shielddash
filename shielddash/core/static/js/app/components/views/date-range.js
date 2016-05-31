import React from 'react';


export default function(props) {
  var formatOptions = { month: "long", day: "numeric", year: "numeric" }
  return (
    <div className="dates">
      <time dateTime={props.startTime}>{new Date(props.startTime).toLocaleDateString('en-US', formatOptions)}</time>
      &ndash;
      <time dateTime={props.endTime}>{new Date(props.endTime).toLocaleDateString('en-US', formatOptions)}</time>
    </div>
  );
}
