from functools import lru_cache
from itertools import combinations
from math import log, exp
from rule import DOUBLE, HALF, IMMUNE, NORMAL, RULE
from jdt import jdtIter

COLDNESS = 1

ALL_TYPES = '普火水草电冰斗毒地飞超虫岩鬼龙恶钢妖'
LOSS = {
    DOUBLE : 2, 
    HALF : .5, 
    IMMUNE : 0, 
    NORMAL : 1, 
}

@lru_cache()
def allTypeCombinations():
    buffer = [( x, ) for x in ALL_TYPES]
    for x, y in combinations(ALL_TYPES, 2):
        buffer.append(( x, y ))
    return buffer

def main():
    records = []
    for team in jdtIter([*
        combinations(allTypeCombinations(), 2)
    ], msg = '2-poke team', UPP = 32):
        x, y = team
        loss = softmax([
            (assess(x, y), 1), 
            (assess(y, x), 1), 
        ])
        records.append(( team, loss ))
    for team in jdtIter([*
        combinations(allTypeCombinations(), 3)
    ], msg = '3-poke team', UPP = 2**12):
        x, y, z = team
        loss_0 = softmax([
            (assess(x, y), 1), 
            (assess(y, z), 1), 
            (assess(z, x), 1), 
        ])
        loss_1 = softmax([
            (assess(x, z), 1), 
            (assess(z, y), 1), 
            (assess(y, x), 1), 
        ])
        if loss_0 < loss_1:
            records.append(( (x, y, z), loss_0 ))
        else:
            records.append(( (z, y, x), loss_1 ))

    result = sorted(records, key = lambda x : x[1])
    print()
    # display(result)
    write(result)

@lru_cache()
def allTripleTypes():
    return [*combinations(ALL_TYPES, 3)]

@lru_cache(maxsize=171**2)
def doubleRule(offe, defe):
    acc = 1
    for o_t in offe:
        for d_t in defe:
            acc *= LOSS[RULE[o_t][d_t]]
    return acc

@lru_cache(maxsize=171**2)
def assess(retreat, assult):
    losses = []
    for x, y, z in allTripleTypes():
        best_action = []
        best_action_loss = 0
        for t in (x, y, z):
            loss = doubleRule(t, retreat)
            if loss == best_action_loss:
                best_action.append(t)
            elif loss > best_action_loss:
                best_action = [ t ]
                best_action_loss = loss
        for t in best_action:
            losses.append((
                doubleRule(t, assult), 
                1 / len(best_action), 
            ))
    return softmax(losses)

def softmax(X):
    return log(
        sum([
            exp(x * COLDNESS) * prob
            for (x, prob) in X
        ]) / sum(
            [prob for (x, prob) in X]
        )
    ) / COLDNESS

@lru_cache(maxsize=171)
def dbTypeRepr(t):
    return ''.join(t)

def write(result):
    with open('result.csv', 'w', encoding='utf-8') as f:
        for (team, assessment) in result:
            print(
                *map(dbTypeRepr, team), 
                assessment, file=f, sep=', ', 
            )

main()
