# ON SECONDARY 
 
Web frontend for NFT Exchange
 

 

### TODO

    - Need to build the  orderPacket server and deploy it at https://api.onsecondary.com so I can make post requests to it like starflask API 
     
    - front page should have tiles for each project (artblocks to start) 

    - need a custom json config for tiles [asset names and stuff ]

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