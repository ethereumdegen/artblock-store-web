# ON SECONDARY 
 
Web frontend for NFT Exchange
 

 

### TODO


-- When an NFT sale happens, wipe out the sell orders  


 

 


--must track which Sell Orders no longer match the owner of the work - so as to hide them ( run a bot on the api server -- delete such offchain orders )




    --add the search back later 

    

   

-run server with pm2 
 

   


### Development commands
```
npm install
npm run dev
```

### Packaging commands
```
npm run build
npm run server
```


## using pm2

 pm2 start pm2.config.json --env production 
pm2 monit 