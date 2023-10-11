class Vehicle {
    constructor(a, b, c) {
        this.make = a;
        this.model = b;
        this.year = c;
    }

    honk() {
        return 'Beep!';
    }

    toString() {
        return `The vehice is a ${this.year}, ${this.make} ${this.model}`;
    }
}

class Car extends Vehicle {
    constructor(a, b, c) {
        super(a, b, c);
    }

    numWheels() {
        return 4;
    }
}

class Motorcycle extends Vehicle {
    constructor(a, b, c) {
        super(a, b, c);
    }

    numWheels() {
        return 2;
    }

    revEngine() {
        return "VROOOM!!";
    }
}

class Garage {
    constructor(capacity) {
        this.capacity = capacity;
        this.vehicles = [];
    }

    add(newVehicle) {
        if (!(newVehicle instanceof Vehicle)) {
            return "Only vehicles are allowed in here!";
        }
        if (this.vehicles.length >= this.capacity) {
            return "Sorry, we're full.";
        }
        this.vehicles.push(newVehicle);
        return "Vehicle added!";
    }
}