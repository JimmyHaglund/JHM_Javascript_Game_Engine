let Component = function()
{
    let entity = null;
    let type = "Component";

    let component = function()
    {
        this.Start = function() {};
        this.Destroy = function() 
        {
            var ID = this;
            var entityIndex = ID.gameEntity.FindComponentIndex(ID);
            if (entityIndex != -1)
            {
                ID.gameEntity.RemoveComponent(entityIndex);
                return;
            }
        };

        this.SetEntity = function(value)
        {
            entity = value;
        };
        this.GetEntity = function(value)
        {
            return entity;
        };

        this.SetType = function(value)
        {
            value = CheckTypeForString(value);
            type = value;
        };
        this.GetType = function(value)
        {
            return type;
        };
    }

    return new component();
}


var Mammal = function() 
{ 
    let legs = 4;
    let eventList = [];
    let eventArgumentList = [];
    let testString = "Error!";
    var mammal = function()
    {
        this.getLegs = function()
        {
            return legs;
        }
        this.setLegs = function(value)
        {
            legs = value;
        }
        this.AddEventSubscriber = function(delegate, arguments = null)
        {
            eventList.push(delegate);
            eventArgumentList.push(arguments);
        }
        this.InvokeEvent = function()
        {
            for (var n = 0; n < eventList.length; ++n)
            {
                eventList[n](eventArgumentList[n]);
            }
        }
    }
    return new mammal();
}


// Elephant = global scope.
let Elephant = function (secretName)
{
    
    let secret = secretName;
    // let legs = 16;

    // elephant is a function defined INSIDE Elephant.
    // This means that when creating a New Elephant()
    // you also create a new DEFINITION fpr elephant.
    //
    // When inheriting from a new Mammal, you also create
    // a new instance of mammal. This has to be done outside
    // the scope of elephant. If this was done to Elephant,
    // it would result in a single instance of Mammal to
    // be created for governing all elephants.
    //
    // Here, each elephant will instantiate a new mammal
    // to be its prototype. This means inheritance is
    // created! Finally! Horray!
    let elephant = function()
    {
        this.Confess = function()
        {
            return secret;
        };
        this.getLegs = function()
        {
            // Use Object.getPrototypeOf(this) to get prototype, then call the inherited function using that.
            var legs = Object.getPrototypeOf(this).getLegs() + 12;
            return legs;
        };
        // Note that it's impossible to acces the prototype's 
        // private variables directly
        /*
        this.getLegs = function()
        {
            return legs; // -> Cannot find variable: legs.
        }
        */
    };
    elephant.prototype = new Mammal();
    console.log(elephant.prototype);
    // elephant.prototype.setLegs(elephant.prototype.getLegs() + 1);
    
    // console.log(elephant.getLegs());

    return new elephant();

    // let prot = Object.create(Mammal);
    // prot.setLegs(legs);
    // elephant.prototype = Object.create(Mammal);
    // console.log(this.prototype.getLegs());
    // this.prototype = new Mammal();
    // console.log(this.prototype);
    // this.prototype.legs++;
    // console.log(Elephant.prototype);
    // return elephant;

}
// Elephant.prototype = new Mammal();
// console.log(Elephant.prototype);

/*
let Component = 
{

}
*/
// Elephant.prototype = Object.create(new Mammal());