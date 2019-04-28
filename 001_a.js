/**
 001: Write a Solver class/object in Javascript that would accept an array in the form of:
 [3, “Plus”, 1], [6, “Times”, 2]... or an object with properties “operand1”, “operator” and “operand2”,
 the option that you prefer, and returns the result of the arithmetics.
 Note: element representing the operator is the name of a function or a reference to that function –
 implement them as well (Plus, Minus, Times and Divide).
 Note: in the future there may be a need to support another operations without changing the existing
 code or changing it as little as possible.
 */


var Solver = function () {
    var results = [];

    for (var i in arguments) {
        results.push(SolveItem(arguments[i]));
    }

    return results;
};

var SolveItem = function (operation) {
    var self = this,
        operand1 = operation[0],
        operator = operation[1],
        operand2 = operation[2];

    if (operand1 instanceof Array) {
        operand1 = SolveItem(operand1);
    } else {
        operand1 = parseInt(operand1, 10);
    }

    if (operand2 instanceof Array) {
        operand2 = SolveItem(operand2);
    } else {
        operand2 = parseInt(operand2, 10);
    }

    function Plus(a, b) {
        return a + b;
    }

    function Minus(a, b) {
        return a + b;
    }

    function Times(a, b) {
        return a * b;
    }

    function Divide(a, b) {
        return a / b;
    }

    switch (operator) {
        case 'Plus':
            total = Plus(operand1, operand2);
            break;
        case 'Minus':
            total = Minus(operand1, operand2);
            break;
        case 'Times':
            total = Times(operand1, operand2);
            break;
        case 'Divide':
            total = Divide(operand1, operand2);
            break;
        default:
            //It could have been an alert, an exception, but a console error will be visible during development
            console.error('"' + operator + '" is not within the valid operations for this function: ' + typeof self);
            break;
    }

    return total;
};

var SolverLazily = function () {
    var results = [];

    for (var i in arguments) {
        results.push(SolveItemLazily(arguments[i]));
    }

    return results;
};

var SolveItemLazily = function (operation) {
    operation = JSON.stringify(operation);
    operation = operation
        .replace(/\s/g, '')
        .replace(/\[/g, "(")
        .replace(/\]/g, ")")
        .replace(/,"Plus",/g, '+')
        .replace(/,"Minues",/g, '-')
        .replace(/,"Times",/g, '*')
        .replace(/,"Divide",/g, '/')

    return eval(operation);
};

var total = Solver(
    [1, "Plus",
        [
            1,
            "Plus", [
            2,
            "Divide",
            2
        ]
        ]
    ], [2, "Plus", 2]);

console.log('Total: ');
console.dir(total);

var totalLazyApproach = SolverLazily(
    [1, "Plus",
        [
            1,
            "Plus", [
            2,
            "Divide",
            2
        ]
        ]
    ], [2, "Plus", 2]);

console.log('Total Lazy Approach: ');
console.dir(totalLazyApproach);

