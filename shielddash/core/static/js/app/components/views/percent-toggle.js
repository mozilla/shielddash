import React from 'react';


export default function(props) {
  let classes = ['switch-wrapper', 'percent-toggle'];
  if (props.showPercentage) {
    classes.push('show-percentage');
  }
  return (
    <div className={classes.join(' ')}>
      {props.switch.from}
      <span className={props.showPercentage ? 'switch active' : 'switch'} onClick={props.doToggle}>
        <b className="handle" />
      </span>
      {props.switch.to}
    </div>
  );
}
