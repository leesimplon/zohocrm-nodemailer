const Profile = require('../models/model');
//for exo1 nodemailer
const nodemailer = require('nodemailer');
//for exo2 zoho
const zoho = require('@trifoia/zcrmsdk');
const conf = require('../config/zoho.config');


var transporter = nodemailer.createTransport({
    host: 'smtp.ionos.fr',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'lee_67@sayna.io',
        pass: 'R*ck_le3'
    }
  });


//Create new profil & send email & register to database
exports.create = (req, res) => {
    var mailOptions = {
        from: 'lee_67@sayna.io',
        to: req.body.email,
        subject: 'can 2019',
        text: 'Alefa '+req.body.nom+' Barea!',
        html: '<div><b>#MiaraMirona<b>;nbsp nodemailer<br/><a href="https://www.google.com/search?ei=hTMkXY-6Ibmn1fAPiZ-WsAI&q=madagascar+tunisia&oq=madagascar+tunisia&gs_l=psy-ab.3..0i324j0i22i30.6727.12734..13453...0.0..0.280.4324.2-18......0....1..gws-wiz.......0i71j0i67j0j0i10j38j0i13i30.KALZvheR9Mw#sie=m;/g/11h6r9t87p;2;/m/01l5zn;dt;fp;1;;">Ato mandeha</a> <br/><a href="https://crm.zoho.com/crm/org692580668/tab/Contacts/custom-view/4084865000000087529/canvas/4084865000000225149">Ty ny Zoho CRM</a></div>'
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    Profile.find()
    .then(user => {
        //autoincrement
        let idautom;
        if(user.length == 0){
            idautom = 0
        }else {
            idautom = parseInt(user[user.length - 1]._id) + 1
        }

        //console.log('image file '+req.body.filename)
    const profil = new Profile({   
             
        _id: idautom,
        nom: req.body.nom , 
        email: req.body.email
    });

    // Save p in the database
    profil.save()
    .then(() => {
        Profile.find()
        .then(data=>{
            res.send(data);
        })
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Something wrong while creating the profil."
            
        });
    });

    zoho.initialize(conf).then((client) => {
        client.API.MODULES.post({
            module: 'Contacts',
            body: {
                // Pay ATTENTION! Data is an array!
                data: [
                  {
                    Last_Name: req.body.nom,
                    Email: req.body.email
                  }
                ],
            },
        }).then((response) => {
            const { data } = JSON.parse(response.body);
            res.json({ data });
        });
    });

})
};

exports.findAll = (req, res) => {   
    Profile.find()
    .then(users => {    
        res.send(users);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Something wrong while retrieving profils."
        });
    });
};

// get ZohoCRM
exports.getAll = (req, res, next) => {
    const { page = 0, per_page = 200} = req.query;
    zoho.initialize(conf).then((client) => {
        client.API.MODULES.get({
            module: 'Contacts', // Module name
            params: {
                page,
                per_page,
            },
        }).then((response) => {
            res.json(JSON.parse(response.body));
        }).catch(next);
    }).catch(next);
}
