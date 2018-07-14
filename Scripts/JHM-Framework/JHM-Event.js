var JHMEvent = function()
{
    let eventList = [];
    let eventArgumentList = [];

    var returnEvent = function()
    {
        this.AddSubscriber = function(delegate, eventArguments = null)
        {
            eventList.push(delegate);
            eventArgumentList.push(eventArguments);
        }
        this.RemoveSubscriber = function(delegate)
        {
            let index = ArrayFindIndex(eventList, delegate);
            ArrayRemoveIndex(eventList, index);
            ArrayRemoveIndex(eventArgumentList, index);
        }
        this.Invoke = function()
        {
            for (var n = 0; n < eventList.length; ++n)
            {
                eventList[n](eventArgumentList[n]);
            }
        }
    }

    return new returnEvent();
}