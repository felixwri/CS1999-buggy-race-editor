
//? would like to do this with native json
//? chrome really didn't like it though

let raw = `
{
    "power_type": {
        "units": "power_units",
        "petrol": {
            "cost": 4,
            "weight": 2,
            "consumable": true
        },
        "fusion": {
            "cost": 400,
            "weight": 400,
            "consumable": false
        },
        "steam": {
            "cost": 3,
            "weight": 4,
            "consumable": true
        },
        "bio": {
            "cost": 5,
            "weight": 2,
            "consumable": true
        },
        "electric": {
            "cost": 20,
            "weight": 20,
            "consumable": true
        },
        "rocket": {
            "cost": 16,
            "weight": 2,
            "consumable": true
        },
        "hamster": {
            "cost": 3,
            "weight": 1,
            "consumable": true
        },
        "thermo": {
            "cost": 300,
            "weight": 100,
            "consumable": false
        },
        "solar": {
            "cost": 40,
            "weight": 30,
            "consumable": false
        },
        "wind": {
            "cost": 20,
            "weight": 30,
            "consumable": false
        }
    },
    "tyres": {
        "units": "qty_tyres",
        "knobbly": {
            "cost": 15,
            "weight": 20
        },
        "slick": {
            "cost": 10,
            "weight": 14
        },
        "steelband": {
            "cost": 20,
            "weight": 28
        },
        "reactive": {
            "cost": 40,
            "weight": 20
        },
        "maglev": {
            "cost": 50,
            "weight": 30
        }
    },
    "armour": {
        "units": "none",
        "none": {
            "cost": 0,
            "weight": 0
        },
        "wood": {
            "cost": 40,
            "weight": 100
        },
        "aluminium": {
            "cost": 200,
            "weight": 50
        },
        "thinsteel": {
            "cost": 100,
            "weight": 200
        },
        "thicksteel": {
            "cost": 200,
            "weight": 400
        },
        "titanium": {
            "cost": 290,
            "weight": 300
        }
    },
    "attack": {
        "units": "qty_attacks",
        "none": {
            "cost": 0,
            "weight": 0
        },
        "spike": {
            "cost": 5,
            "weight": 10
        },
        "flame": {
            "cost": 20,
            "weight": 12
        },
        "charge": {
            "cost": 28,
            "weight": 25
        },
        "biohazard": {
            "cost": 30,
            "weight": 10
        }
    },
    "misc": {
        "hamster_booster": 5,
        "fireproof": 70,
        "insulated": 100,
        "antibiotic": 90,
        "banging": 42
    }
}`

const prices = JSON.parse(raw);