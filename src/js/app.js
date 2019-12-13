App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Restaurants.json", function(Restaurants) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Restaurants = TruffleContract(Restaurants);
      // Connect provider to interact with contract
      App.contracts.Restaurants.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.Restaurants.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.votedEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
    });
  },

  render: function() {
    var restaurantInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load contract data
    App.contracts.Restaurants.deployed().then(function(instance) {
      restaurantInstance = instance;
      return restaurantInstance.restaurantCount();
    }).then(function(restaurantCount) {
      var restaurantResults = $("#restaurantResults");
      restaurantResults.empty();

      var restaurantSelect = $('#restaurantSelect');
      restaurantSelect.empty();

      for (var i = 1; i <= restaurantCount; i++) {
        restaurantInstance.restaurants(i).then(function(restaurant) {
          var id = restaurant[0];
          var name = restaurant[1];
          var type = restaurant[2];
          var voteCount = restaurant[3];

          // Render candidate Result
          var restaurantTemplate = "<tr><th>" + id + "</th><td>" + name + "</th><td>" + type + "</td><td>" + voteCount + "</td></tr>"
          restaurantResults.append(restaurantTemplate);

          // Render candidate ballot option
          var restaurantOption = "<option value='" + id + "' >" + name + "</ option>"
          restaurantSelect.append(restaurantOption);
        });
      }
      return restaurantInstance.voters(App.account);
    }).then(function(hasVoted) {
      // Do not allow a user to vote
      if(hasVoted) {
        $('#vote').hide();
      }
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },

  castVote: function() {
    var restaurantId = $('#restaurantSelect').val();
    App.contracts.Restaurants.deployed().then(function(instance) {
      return instance.vote(restaurantId, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },

  addRestaurant: function() {
    var restaurantName = $('#restaurantsAddName').val();
    var restaurantType = $('#restaurantsAddType').val();
    App.contracts.Restaurants.deployed().then(function(instance) {
      return instance.addRestaurant(restaurantName, restaurantType, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});