def get(**kwargs):

    owner = "guest"
    unnamedId = 10000000
    asArray = True

    for key, value in kwargs.items():
        if key == "owner":
            owner = value
        elif key == "unnamedId":
            unnamedId = value
        elif key == "asArray":
            asArray = value

    if asArray:
        data = [
            0,
            4,
            '#000000',
            '#aa1111',
            'plain',
            'petrol',
            1,
            'None',
            0,
            0,
            'knobbly',
            4,
            'None',
            'None',
            0,
            'False',
            'False',
            'False',
            'False',
            'steady',
            0,
            owner,
            unnamedId,
            'Unnamed',
        ]
    else:
        data = {
            "id": "0",
            "qty_wheels": "4",
            "flag_color": '#000000',
            "flag_color_secondary": '#aa1111',
            "flag_pattern": 'plain',
            "power_type": 'petrol',
            "power_units":  "1",
            "aux_power_type": 'None',
            "aux_power_units": "0",
            "hamster_booster":  "0",
            "tyres": 'knobbly',
            "qty_tyres": "4",
            "armour": 'None',
            "attack": 'None',
            "qty_attacks": "0",
            "fireproof": 'False',
            "insulated": 'False',
            "antibiotic": 'False',
            "banging": 'False',
            "algo": 'steady',
            "total_cost": "0",
            "owner": owner,
            "private": str(unnamedId),
            "buggy_name": 'Unnamed'
        }

    return data
