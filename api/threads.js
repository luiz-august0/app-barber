import { teste } from "./threadJobs/teste";

function loopThread() {
	setTimeout(function(){
		setTimeout(async function(){
			await teste();
			console.log('ThreadTeste executed');
		}, 0);

		setTimeout(async function() {
			console.log('ThreadTeste2 executed');
		},0)
		
		loopThread();
	}, 2000)
}

loopThread();