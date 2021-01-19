//budget controller
var budgetController = (function() {
    //internal calculation
    var Expansions = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };


    // Expansions.prototype.calcPercen = function(totalIncome) {
    //     if (totalIncome > 0) {
    //         this.percentage = Math.round((this.value / totalIncome) * 100);
    //     } else {
    //         this.percentage = -1;
    //     }
    // };


    Expansions.prototype.getPercentage = function() {
        return this.percentage;
    };


    var income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };


    calcculateTotal = function(type) {
        var sum = 0;
        data.allItem[type].forEach(function(cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
    }


    var data = {
        allItem: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };


    return {
        addItem (type, description, value) {
            var newItem, ID;
            //get id for the element
            if (data.allItem[type].length > 0) {
                ID = data.allItem[type][data.allItem[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            //create an element
            if (value === 'exp') {
                newItem = new Expansions(ID, description, value);
            } else {
                newItem = new income(ID, description, value);
            }

            //push into data structure
            data.allItem[type].push(newItem);
            //return the new item

            return newItem;

        },

        deleteItem: function(type, id) {
            var ids, index;


            ids = data.allItem[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItem[type].splice(index, 1);
            }
        },

        calculateBudget: function() {
            //cal total income and expanses
            calcculateTotal('exp');
            calcculateTotal('inc');
            //cal income - expanses
            data.budget = data.totals.inc - data.totals.exp;
            //cal percentages
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }

        },

        calculatePercentages: function() {
            // data.allItem.exp.forEach(function(curr) {
            //     console.log(curr);
            //     curr.calcPercen(data.totals.inc);
            // });
            var allperc = [];
            console.log(data.allItem.exp.length);
            for (var i = 0; i < data.allItem.exp.length; i++) {
                if (data.totals.inc > 0) {
                    data.allItem.exp[i].percentage = Math.round((data.allItem.exp[i].value / data.totals.inc) * 100);
                    //console.log(data.allItem.exp[i].percentage);
                    allperc[i] = data.allItem.exp[i].percentage;
                } else {
                    data.allItem.exp[i].percentage = -1;
                    allperc[i] = data.allItem.exp[i].percentage;
                }

            }
            return allperc;
        },

        // getPercentages: function() {
        //     var allperc = [];
        //     // allperc = data.allItem.exp.map(function(cur) {
        //     //     return cur.getPercentage();
        //     // });
        //     for (var i = 0; i < data.allItem.exp.length; i++) {
        //         //allperc[i] = 
        //         console.log(data.allItem.exp[i].percentage);
        //     }
        //     return allperc;
        // },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },
        
        ou: function() {
            console.log(data);
        }
    };

})();



//UI controller
var UIController = (function() {
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomcontainer: '.income__list',
        expensescontainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expansesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expansePercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };
    formatNumbar = function(num, type) {
        var numSplit, int, dec;
        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split('.');
        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }
        dec = numSplit[1];
        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    }

    var nodeListforEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    return {

        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            }
        },
        addListItem: function(obj, type) {
            var html, newHtml, element;
            //add html string with placeholder text
            if (type === 'inc') {
                element = DOMStrings.incomcontainer
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMStrings.expensescontainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            //replace the placeholder with data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumbar(obj.value, type));
            //modefy the dom

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },


        deleteListItem: function(selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
        clearField: function() {
            var field, fieldArr;
            field = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);

            fieldArr = Array.prototype.slice.call(field);
            fieldArr.forEach(function(current, index, array) {
                current.value = "";
            });
            fieldArr[0].focus();
        },

        displayBudget(obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumbar(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumbar(obj.totalInc, 'inc');
            document.querySelector(DOMStrings.expansesLabel).textContent = formatNumbar(obj.totalExp, 'exp');
            document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage;
            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '---'
            }
        },
        displayPercentages: function(percentages) {

            var fields = document.querySelectorAll(DOMStrings.expansePercLabel);


            nodeListforEach(fields, function(curr, index) {
                if (percentages[index] > 0) {
                    curr.textContent = percentages[index] + '%';
                } else {
                    curr.textContent = '---';
                }


            });


        },

        displaymonth: function() {
            var now, year, month, months;
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'november', 'December'];

            now = new Date();
            year = now.getFullYear();
            month = now.getMonth();
            document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;
        },

        changedType: function() {
            var fields = document.querySelectorAll(
                DOMStrings.inputType + ',' +
                DOMStrings.inputDescription + ',' +
                DOMStrings.inputValue
            );
            nodeListforEach(fields, function(cur) {
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
        },
        getDOMStrings: function() {
            return DOMStrings;
        }
    };
})();




//Global app controller
var controller = (function(budgetCtrl, UICtrl) {

    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMStrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {

            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };

    var updateBudget = function() {

        //calculate the budget
        budgetCtrl.calculateBudget();
        //return budget
        var budget = budgetCtrl.getBudget();
        //display the budget on the UI
        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function() {

        //calculate percentages
        //console.log('yo');
        var percentages = budgetCtrl.calculatePercentages();
        //console.log(percentages);
        //read percentages from budget controller
        //var percentages = budgetCtrl.getPercentages();
        //update the UI with the new percentsges
        UICtrl.displayPercentages(percentages);

    };
    var ctrlAddItem = function() {

        var input, newItem;
        //get the field input data
        input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            //add the item to budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        }


        //add the item to the UI
        UICtrl.addListItem(newItem, input.type);
        //clear the input fields
        UICtrl.clearField();

        updateBudget();

        //update percentages
        updatePercentages();
        console.log(newItem);
    }

    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //dalete item from data structure
            budgetCtrl.deleteItem(type, ID);
            //dalete data item form UI

            console.log(itemID);
            UICtrl.deleteListItem(itemID);
            //update and show the budget
            updateBudget();
            //update percentages
            updatePercentages();
        }

    }
    return {
        init: function() {
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            UICtrl.displaymonth();
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();