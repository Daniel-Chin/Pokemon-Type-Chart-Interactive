import csv

ALL_TYPES = '普火冰草电冰斗毒地飞超虫岩鬼龙恶钢妖'
DOUBLE = 'DOUBLE'
HALF = 'HALF'
IMMUNE = 'IMMUNE'
NORMAL = 'NORMAL'

def main():
    rule = {}
    with open('rule.csv', 'r', encoding='utf-8') as f:
        c = csv.reader(f)
        header = next(c)[1:]
        for line in c:
            atta = line.pop(0).strip()
            for defe, symbol in zip(header, line):
                try:
                    row = rule[atta]
                except KeyError:
                    row = {}
                    rule[atta] = row
                row[defe.strip()] = {
                    '+': DOUBLE, 
                    '-': HALF, 
                    '0': IMMUNE, 
                    '1': NORMAL, 
                }[symbol.strip()]
    for t0 in ALL_TYPES:
        row = rule[t0]
        for t1 in ALL_TYPES:
            row[t1]
            # this must not raise KeyError. 
    with open(
        'react_app/src/rule.js', 'w', encoding='utf-8', 
        newline='\n',
    ) as f:
        print('import { DOUBLE, HALF, IMMUNE, NORMAL } from "./shared.js"; \n', file=f)
        print('const RULE = {', file=f)
        for k, v in rule.items():
            print(' ', k, ': {', file=f)
            for kk, vv in v.items():
                print('   ', kk, ':', vv, ', ', file=f)
            print('  }, ', file=f)
        print('}; \n', file=f)
        print('export default RULE;', file=f)

main()
