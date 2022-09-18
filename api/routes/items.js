const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Item = require('../models/item');
const checkToken = require('../middleware/checkToken');
const fs = require('fs')
const path = require('path')
const crypto = require('crypto');
const buffer = require('buffer');

const privateKey = fs.readFileSync(path.join(__dirname, 'keys', 'rsa.key'), 'utf8');

router.get('/', checkToken, (req, res, next) => {
    Item.find().select("_id name").exec().then(docs => {
      console.log(docs);
      res.status(200).json(docs);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: error
      });
    });
});

router.post('/', checkToken, (req, res, next) => {
    const item = new Item({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name
    });
    item.save().then( result => {
        console.log(result);
        res.status(201).json({
            message: 'Post request',
            createdItem: result    
        });
    })
    .catch( error => {
        console.log(error);
        res.status(500).json({
            error: error
        })
    });     
});

router.get('/:itemID', checkToken, (req, res, next) => {
    const id = req.params.itemID;
    Item.findById(id).exec().then(doc => {
        console.log(doc);
        if (doc) {
            const nonce = Buffer.from(req.body.nonce);
            const signature = crypto.sign("SHA256", nonce , privateKey);
            const isVerified = crypto.verify("SHA256", nonce, req.body.publicKey, signature);
            if(isVerified) {
                res.status(200).json(doc);}
        } else {
            res.status(404).json({
                message: 'No item with that ID'
             });
            }
    }).catch(error => {
        console.log(error);
        res.status(500).json({error: error});
    });
});

router.delete("/:itemId", checkToken, (req, res, next) => {
    const id = req.params.itemId;
    Item.remove({ _id: id })
      .exec()
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({
          error: error
        });
      });
  });


module.exports = router;
