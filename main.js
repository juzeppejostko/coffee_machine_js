// Use "input()" to input a line from the user
// Use "input(str)" to print some text before requesting input
// You will need this in the following stages
const input = require('sync-input');

var exit = false;

let coffee_machine = {
    resources: {
        money: 550,
        water: 400,
        milk: 540,
        beans: 120,
        sugar: 350,
        cups: 9
    },
    coffee_recipe: {
        espresso: {
            water: 250,
            beans: 16,
            price: 4
        },
        latte: {
            water: 350,
            milk: 75,
            beans: 20,
            price: 7
        },
        cappuccino: {
            water: 200,
            milk: 100,
            beans: 12,
            price: 6
        },

    },
    status: function (){
        console.log(`\nThe coffee machine has:
${this.resources.water} ml of water
${this.resources.milk} ml of milk
${this.resources.beans} g of coffee beans
${this.resources.sugar} g of sugar
${this.resources.cups} disposable cups
$${this.resources.money} of money`);
    },

    fill: function () {
        console.log(`\nWrite how many ml of water you want to add`);
        this.resources.water += Number(input());
        console.log(`Write how many ml of milk you want to add::`);
        this.resources.milk += Number(input());
        console.log(`Write how many grams of coffee beans you want to add:`);
        this.resources.beans += Number(input());
        console.log(`Write how many grams of sugar you want to add:`);
        this.resources.sugar += Number(input());
        console.log(`Write how many disposable coffee cups you want to add:`);
        this.resources.cups += Number(input());
        //console.log('\n')
    },
    take: function (){
        console.log(`\nI gave you $${this.resources.money}`)
        //console.log('\n')
        this.resources.money = 0;
    },
    sugar_portion : 0,
    add_sugar: function (){
        console.log(`\nHow many gramms of sugar do you want to add (0; 5; 10 or 15)?:`);
        const user_chose = Number(input());
        if ((0 <= user_chose) && (user_chose <= 15)){
            switch (user_chose) {
                case 0:
                    this.sugar_portion = 0;
                    break;
                case 5:
                    this.sugar_portion = 5;
                    break;
                case 10:
                    this.sugar_portion = 10;
                    break;
                case 15:
                    this.sugar_portion = 15;
                    break;
                default:
                    console.log(`Unknown input`)
                    break;
            }
            } else{
            console.log(`Unknown input`);
            this.add_sugar();
        }

    },

    buy: function (){
        console.log(`\nWhat do you want to buy? 1 - espresso, 2 - latte, 3 - cappuccino:`);
        const user_chose = Number(input());
        let product = ``;
        this.add_sugar();
        switch (user_chose) {
            case 1:
                product = `espresso`;
                break;
            case 2:
                product = `latte`;
                break;
            case 3:
                product = `cappuccino`;
                break;
            default:
                console.log(`Unknown input`)
                break;
        }

        if (product != '') {
            const max_milk_portions = this.resources.milk / this.coffee_recipe[product].milk;
            const max_water_portions = this.resources.water / this.coffee_recipe[product].water;
            const max_beans_portions = this.resources.beans / this.coffee_recipe[product].beans;
            if (this.sugar_portion !=0){
                max_sugar_portions = this.resources.sugar / this.sugar_portion;
            } else{
                max_sugar_portions = 1000;
            }
            const max_cups_we_can_make = Math.floor(Math.min(max_water_portions, max_milk_portions, max_beans_portions, max_sugar_portions));

            //console.log("Milk: %d, Water: %d, Beans: %d",max_milk_portions, max_water_portions,max_beans_portions);

            function check_av() {
                if (max_milk_portions < 1) {
                    return "milk";
                } else if (max_water_portions < 1) {
                    return "water";
                } else if (max_beans_portions < 1) {
                    return "beans";
                } else if (coffee_machine.resources.cups < 1) {
                    return "cups";
                } else if (max_sugar_portions < 1) {
                    return "sugar";
                } else {
                    return "OK"
                }
            }

            if (check_av() == "OK") {
                console.log("I have enough resources, making you a coffee!");
                for (let resource in this.coffee_recipe[product]) {
                    if (resource === 'price') {
                        this.resources.money += Number(this.coffee_recipe[product][resource]);
                        continue;
                    }
                    this.resources[resource] -= Number(this.coffee_recipe[product][resource]);
                }
                this.resources.cups -= 1;
                this.resources.sugar -= this.sugar_portion;
            } else console.log("Sorry, not enough %s!", check_av());
        }else{
            coffee_machine.take_user_action()
        }
    },

    take_user_action: function () {
//      this.status();
        //console.log(`\n`);
        console.log(`\nWrite action (buy, fill, take, remaining, exit):`);
        const user_chose = input();
        switch (user_chose){
            case `buy`:
                this.buy();
                break;
            case `fill`:
                this.fill();
                break;
            case `take`:
                this.take();
                break;
            case 'remaining':
                this.status();
                break;
            case 'exit':
                exit = true;
                break;
            default:
                console.log(`Unknown input`)
                break;
        }
        //console.log(`\n`)
        //this.status();
    }
}

while (exit == false){
    //console.log(coffee_machine.resources);
    coffee_machine.take_user_action();
}