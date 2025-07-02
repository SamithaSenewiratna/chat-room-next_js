import { Button } from "@/components/ui/button";

type Prpos = {
    params:{
        userId:string;
    };
};

export default function userDetails({
    params:{userId}}:Prpos) {
  return (
   <>
    <p >hi userid {userId}</p>
   </>
  );
}
