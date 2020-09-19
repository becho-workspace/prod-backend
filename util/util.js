module.exports.queryCheck=(start,end,total)=>
{
    if(start && !end )
    {
        if(start>total || start<0 || total<0 || end==0)
        {
            return false
        }
        return true;
    }
    else if(!start && end)
    {
       if(end<0 || end>total || total<0 || start==0)
       {
           return false;
       }
       return true;
    }
    else if(start && end)
    {
        if(start>total || end>total  || end<start || end<0 || start<0  || total<0)
       {
          return false;
       }
       return true;
    }

    else
    {
        return false;
    }
   
}