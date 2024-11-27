const orderData = {
    restaurant: 'Chick-Fil-A',
    total: 14.73,
    customer: 'Henry Cavill'
}

// Your code goes here
class Order {
    constructor(restaurant, total, customer) {
        this.restaurant = restaurant;
        this.total = total;
        this.customer = customer;
        this.foodStatus = 0;
        this.validFoodStatuses = [0,1,2,3];
    }

    get orderStatus() {
        switch(this.foodStatus) {
            case 0: 
                return "Waiting for the restaurant to accept the order";
            case 1: 
                return "Your order is being prepared";
            case 2:
                return "Your order is ready for pickup";
            case 3:
                return "Your order has been collected";
            default:
                return "Something went wrong";
        }
    }

    set orderStatus(newStatus) {
        if(this.validFoodStatuses.includes(newStatus)) {
            this.foodStatus = newStatus;
        }
        else {
            this.foodStatus = null;
        }
    }
}

const result= new Order(orderData.restaurant, orderData.total, orderData.customer);
