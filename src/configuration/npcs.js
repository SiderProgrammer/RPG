export default {
  NPC_1: {
    assets: {
      image: "",
      sound: ""
    },
    movementPatterns: [],
    distanceToDialogue: 100,
    dialog: {
      firstMessage: {
        say: "Hi!, how are you?",
        answers: [
          {
            reply: "Good",
            linkTo: "great"
          },
          {
            reply: "Been better",
            linkTo: "sorry"
          }
        ]
      },
      great: {
        say: "That's great. See you next time.",
        answers: [
          {
            reply: "Thanks"
          }
        ]
      },
      sorry: {
        say: "Sorry. Hope you feel better soon.",
        answers: [
          {
            reply: "Thank you"
          }
        ]
      }
    }
  },
  NPC_2: {
    assets: {
      image: "",
      sound: ""
    },
    movementPatterns: [{ x: 1000, y: 300 }],
    distanceToDialogue: 100,
    dialog: {
      hello: {
        say: "Hi!, I'm an sample moving NPC. How are you?",
        answers: [
          {
            reply: "Good",
            linkTo: "great"
          },
          {
            reply: "Been better",
            linkTo: "sorry"
          }
        ]
      },
      great: {
        say: "That's great. See you next time.",
        answers: [
          {
            reply: "Thanks"
          }
        ]
      },
      sorry: {
        say: "Sorry. Hope you feel better soon.",
        answers: [
          {
            reply: "Thank you"
          }
        ]
      }
    }
  },
  NPC_3: {
    assets: {
      image: ""
    },
    movementPatterns: [{ x: 850, y: 1050 }],
    distanceToDialogue: 100,
    dialog: {
      hello: {
        say: "Hi!, I'm a second sample moving NPC. My dialogue is a bit longer. How are you?",
        answers: [
          {
            reply: "Great!",
            linkTo: "talk"
          },
          {
            reply: "Goodbye"
          }
        ]
      },
      talk: {
        say: "The weather is great today.",
        answers: [
          {
            reply: "That's right!",
            linkTo: "talk_2"
          }
        ]
      },

      talk_2: {
        say: "Just kidding, it's tragic",
        answers: [
          {
            reply: "Idiot!"
          },
          {
            reply: "Very funny!",
            linkTo: "talk_3"
          }
        ]
      },
      talk_3: {
        say: "Hahahah",
        answers: [
          {
            reply: "Bye"
          }
        ]
      }
    }
  }
};
