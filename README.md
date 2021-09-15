# ON SECONDARY 
 
Web frontend for NFT Exchange
 

 

### TODO


    -click on your address in upper right corner should take you to your profile 


    - front page should have tiles for each project (artblocks to start) 

    - need a custom json config for tiles 

    --add the search back later 
    

  
 -set up proxy in nginx , port 3000 for api (api.buythefloor.com) using HTTPs certs 


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