pragma solidity ^0.5.11;

contract Restaurants {
    // Movie model
    struct Restaurant{
        uint id;
        string restaurantName;
        string typeOfFood;
        uint voteCount;
    }

    // Store which accounts that have voted
    mapping(address => bool) public voters;

    // Fetch Restaurant
    mapping(uint => Restaurant) public restaurants;

    // Store Candidates Count
    uint public restaurantCount;

    // voted event
    event votedEvent (
        uint indexed _restaurantId
    );

    constructor () public {
        addRestaurant("Cactus", "Mexican Food");
        addRestaurant("China Star", "Chinese Food");
    }

    function addRestaurant (string memory _name, string memory _type) public {
        restaurantCount ++;
        restaurants[restaurantCount] = Restaurant(restaurantCount, _name, _type, 0);
    }

    function vote (uint _restaurantId) public {
        // require that they haven't voted before and voting for valid restaurant
        require(!voters[msg.sender]);
        require(_restaurantId > 0 && _restaurantId <= restaurantCount);

        // record that voter has voted and update vote counts
        voters[msg.sender] = true;
        restaurants[_restaurantId].voteCount ++;

        // trigger voted event
        emit votedEvent(_restaurantId);
    }
}