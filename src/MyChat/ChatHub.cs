using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using StackExchange.Redis;
using System.Linq;

namespace MyChat
{

    public class Brarrge
    {
        public Brarrge()
        {

        }
        public Brarrge(int time,string text,string color)
        {
            this.Time=time;
            this.Text=text;
            this.Color=color;
        }
        public int Time{get;set;}
        public string Text{get;set;}

        public string Color{get;set;}
    }

    public class RedisStore
    {
        private IDatabase _db;

        public RedisStore()
        {
            var connection = ConnectionMultiplexer.Connect("127.0.0.1");
            this._db = connection.GetDatabase(0);
        }

        private readonly string Key= "BARRAGE";
            
        

        public void Add(Brarrge value)
        {
            var message = JsonConvert.SerializeObject(value);
            this._db.SetAdd(Key,message);
        }

        public Brarrge[] Get()
        {
            var values = this._db.SetMembers(Key)??new RedisValue[0];

            return values.Select(p=>JsonConvert.DeserializeObject<Brarrge>(p)).ToArray();
        }
    }
    public class ChatHub : Hub
    {
        private RedisStore _store;

        public ChatHub(RedisStore store)
        {
            this._store=store;
        }
        public Task SendMessage(string message, int time,string color)
        {
            //var obj = new{message=message,time=time};

            this._store.Add(new Brarrge(time,message,color));
            return Clients.All.SendAsync("on_revice", message, time,color);
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {

            return base.OnDisconnectedAsync(exception);
        }

    }
}
