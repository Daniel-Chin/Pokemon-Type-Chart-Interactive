import React from 'react';
import { COLOR, formatRGB, isDark } from "./color.js"; 

const UNIT = 'em';
const SIZE = 1.5;

const Cell = ({
  x, y, t, selected, is_checkbox, label, onCheckboxChange, 
  onMouseEnter, onMouseLeave, hover_x, hover_y, 
  is_type_heading, atta, defe, is_body, tooltip, 
}) => {
  let color = 'initial';
  let back_color = 'initial';
  if (is_type_heading) {
    back_color = formatRGB(COLOR[t]);
    color = isDark(COLOR[t]) ? 'white' : 'black';
  } else if (is_body) {
    if (x === y) {
      back_color = '#eee';
    } else {
      if (selected.includes(atta) || selected.includes(defe)) {
        back_color = '#333';
        color = 'white';
      }
    }
  }
  const style = {
    left: `${x * SIZE}${UNIT}`, 
    top : `${y * SIZE}${UNIT}`, 
    width : `${SIZE}${UNIT}`, 
    height: `${SIZE}${UNIT}`, 
    backgroundColor: back_color,
    color: color, 
  };
  const hover_mirror = x === hover_y && y === hover_x;
  const hover_col = x === hover_x || hover_mirror;
  const hover_row = y === hover_y || hover_mirror;
  const inStyle = {
    borderLeftColor: hover_col ? '#888' : 'rgba(0, 0, 0, 0)', 
    borderRightColor: hover_col ? '#888' : 'rgba(0, 0, 0, 0)', 
    borderTopColor: hover_row ? '#888' : 'rgba(0, 0, 0, 0)', 
    borderBottomColor: hover_row ? '#888' : 'rgba(0, 0, 0, 0)', 
  }

  return (
    <div 
      className='cell' style={style} title={tooltip}
      onMouseEnter={onMouseEnter && onMouseEnter.bind(null, x, y)} 
      onMouseLeave={onMouseLeave && onMouseLeave.bind(null, x, y)}
    >
      <div className='in-cell' style={inStyle}>
        {is_checkbox ? <input 
          type='checkbox' checked={selected.includes(t)} 
          onChange={onCheckboxChange.bind(null, t)}
        /> : label}
      </div>
    </div>
  );
};

export default Cell;
