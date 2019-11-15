const emailTemplates = (aUser, aEmailIndex) => {
    const link = `${window.location.protocol}//${window.location
        .host}/${aUser.hash}`;

    const emails = [
        {
            subject: 'Secret Santa 1st December',
            html: `Hi ${aUser.name}<br /><br />
                Welcome to the Secret Santa Name Generator<br /><br />
                Visit <a href="${link}">${link}</a> to find out who you're 
                buying a gift for!
                <br /><br />Cheers!<br /><br />Kirsty xx`,
            text: `Hi ${aUser.name}\n\n, 
                Welcome to the Secret Santa Name Generator\n\n
                Visit ${link} to find out who you're buying a gift for!\n\n
                Cheers!\n\nKirsty xx`
        },
        {
            subject: 'Secret Santa Reminder!',
            html: `Hi ${aUser.name}<br /><br />
                Did you get my email about the Secret Santa?<br /><br />
                Time's running out!<br /><br />
                Visit <a href="${link}">${link}</a> to find out who you're 
                buying a gift for!
                <br /><br />Cheers!<br /><br />Kirsty xx`,
            text: `Hi ${aUser.name}\n\n, 
                Did you get our email about the Secret Santa?\n\n
                Time's running out!\n\n
                Visit ${link} to find out who you're buying a gift for!\n\n
                Cheers!\n\nKirsty xx`
        },
        {
            subject: 'You joined the Secret Santa!',
            html: `Hi ${aUser.name}<br /><br />
                I've removed your email address from the database now, so just
                in case you forget, you're buying a gift for ${aUser.tempBuyingFor}.
                <br /><br />
                <br /><br />Cheers!<br /><br />Kirsty xx`,
            text: `Hi ${aUser.name}\n\n, 
                I've removed your email address from the database now, so just
                in case you forget, you're buying a gift for ${aUser.tempBuyingFor}.\n\n
                Cheers!\n\nKirsty xx`
        }
    ];

    const email = emails[aEmailIndex];

    if (aEmailIndex === 2) {
        delete aUser.tempBuyingFor;
    }
    return email;
};

export default emailTemplates;


