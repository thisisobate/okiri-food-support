import React from 'react';
import { useEffect, useState, useRef } from 'react';
import Talk from 'talkjs';

const APP_ID = 'tPu8DfPS';


export const Chat = () => {
   const inboxEl = useRef(null);


   // wait for TalkJS to load
   const [talkLoaded, markTalkLoaded] = useState(false);
    useEffect(() => {
     Talk.ready.then(() => markTalkLoaded(true));
      if (talkLoaded) {
       const currentUser = new Talk.User({
         id: '1',
         name: 'Henry Mill',
         email: 'henrymill@example.com',
         photoUrl: 'henry.jpeg',
         welcomeMessage: 'Hi, how may I help you?',
         role: 'admin',
       });

       const otherUser = new Talk.User({
        id: '2',
        name: 'Jessica Wells',
        email: 'jessicawells@example.com',
        photoUrl: 'jessica.jpeg',
        welcomeMessage: 'Hello!',
        role: 'default',
      });
        
        const session = new Talk.Session({
         appId: APP_ID,
         me: currentUser,
       });
        const conversationId = Talk.oneOnOneId(currentUser, otherUser);
       const conversation = session.getOrCreateConversation('3e5b86cb367a6b8c0689');
      //  conversation.setParticipant(currentUser);

      let isAnswered = 'false';
      let role = 'admin'

      session.onMessage(message => {
        console.log('otiloooooo', message)
          if (message.conversation?.custom?.answered === "false") {
            console.log('otiloooooo', message.sender?.role)
            isAnswered = message.conversation?.custom?.answered;
            if (message.sender?.role === "admin") {
              role = message.sender.role;
              message.conversation.custom = { "answered": "true", };
              message.custom = { "answered": "true", };
              console.log('no1', message.conversation)
            }

            if (message.sender?.role === "default") {
              role = message.sender.role;
              conversation.setAttributes({custom: { "answered": "false", }});
            }
          }
      })

      if (isAnswered === "false") {
        if (role === "admin") {
          conversation.setAttributes({custom: { "answered": "true", }});
          conversation.custom = { "answered": "true", };
        }

        if (role === "default") {
          conversation.setAttributes({custom: { "answered": "false", }});
          conversation.custom = { "answered": "false", };
        }
      }

        const inbox = session.createInbox();

        inbox.setFeedFilter({
          custom: {
            answered: ["==", "false"],
          }
        })

        inbox.mount(inboxEl.current);
        return () => session.destroy();
     }
   }, [talkLoaded]);
    return <div ref={inboxEl} className='chat-ui' />;
  };