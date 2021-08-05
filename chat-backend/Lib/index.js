class Helper{
    constructor(){
        this.users=[];
    }

    joinUser(socketid,username,roomid){
      const singleUser={
          userId:socketid,
          userName:username,
          roomId:roomid
      }
      this.users.push(singleUser);
    }

    getSingleUser(socketid){
        return this.users.find((p_user) => p_user.userId === socketid);
    }

    deleteUser(socketid){
        this.users=this.users.filter((value)=>{
            return value.userId!=socketid;
        });
    }
}

module.exports=Helper;
