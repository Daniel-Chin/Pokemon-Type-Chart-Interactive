import React, { useState } from 'react';
import './App.css';
import RULE from './rule.js';
import { DOUBLE, HALF, IMMUNE, NORMAL } from "./shared.js"; 
import Cell from './Cell';

const ATTA = '⚔'
const DEFE = '🛡'
const ALL_TYPES = [...'普火水草电冰斗毒地飞超虫岩鬼龙恶钢妖'];
const N = ALL_TYPES.length;
const DISPLAY = {
  [DOUBLE]: ATTA, 
  [HALF]: DEFE, 
  [IMMUNE]: '🙅‍♀️', 
  [NORMAL]: '', 
};

const App = () => {
  const [ selected, set_selected ] = useState(['冰']);
  const [ hover_x, set_hover_x ] = useState(-1);
  const [ hover_y, set_hover_y ] = useState(-1);

  const order = computeOrder(selected);

  const onCheckboxChange = (t) => {
    if (selected.includes(t)) {
      set_selected(selected.filter(x => x !== t));
    } else {
      set_selected([...selected, t]);
    }
  };

  const onMouseEnter = (x, y) => {
    set_hover_x(x);
    set_hover_y(y);
  };
  const onMouseLeave = (x, y) => {
    if (hover_x === x) set_hover_x(-1);
    if (hover_y === y) set_hover_y(-1);
  };

  return (
    <div>
      <h1 className='center'>
        Interactive Pokemon Type Chart
      </h1>
      <p className='center'>
        Made by {' '}
        <a href='https://inspiring-yonath-a67980.netlify.app/'>
          Daniel Chin
        </a>.
        <br />
        Click a checkbox to toggle selection. 
        <br />
        Source code at {' '}
        <a href='https://github.com/Daniel-Chin/Pokemon-Type-Chart-Interactive'>
          Github repo
        </a>. 
      </p>
      <div className='relative'>
        {
          ALL_TYPES.map((t, i) => (
            <Cell 
              x={0} y={order.indexOf(t) + 3} key={i}
              label={<b>{ATTA}</b>}
            />
          ))
        }
        {
          ALL_TYPES.map((t, i) => (
            <Cell 
              y={0} x={order.indexOf(t) + 3} key={i}
              label={<b>{DEFE}</b>}
            />
          ))
        }
        {
          ALL_TYPES.map((t, i) => (
            <Cell 
              x={1} y={order.indexOf(t) + 3} key={i} t={t}
              selected={selected}
              is_checkbox onCheckboxChange={onCheckboxChange} 
            />
          ))
        }
        {
          ALL_TYPES.map((t, i) => (
            <Cell 
              y={1} x={order.indexOf(t) + 3} key={i} t={t} 
              selected={selected}
              is_checkbox onCheckboxChange={onCheckboxChange} 
            />
          ))
        }
        {
          ALL_TYPES.map((t, i) => (
            <Cell 
              x={2} y={order.indexOf(t) + 3} key={i} label={t} 
              hover_x={hover_x} hover_y={hover_y} 
              is_type_heading t={t}
            />
          ))
        }
        {
          ALL_TYPES.map((t, i) => (
            <Cell 
              y={2} x={order.indexOf(t) + 3} key={i} label={t} 
              hover_x={hover_x} hover_y={hover_y} 
              is_type_heading t={t}
            />
          ))
        }
        {
          ALL_TYPES.map((atta, i) => {
            const y = order.indexOf(atta);
            return ALL_TYPES.map((defe, j) => {
              const x = order.indexOf(defe);
              return <Cell 
                x={x + 3} y={y + 3} key={i * N + j}
                label={DISPLAY[RULE[atta][defe]]} 
                onMouseEnter={onMouseEnter} 
                onMouseLeave={onMouseLeave}
                hover_x={hover_x} hover_y={hover_y}
                selected={selected} atta={atta} defe={defe}
                is_body tooltip={`${atta}${ATTA}${DEFE}${defe}`}
              />
            })
          })
        }
        <Cell x={N + 3} y={N + 3} label='.' />
      </div>
    </div>
  );
};

const computeOrder = (selected) => (
  selected.concat(ALL_TYPES.filter(x => !selected.includes(x)))
);

export default App;
