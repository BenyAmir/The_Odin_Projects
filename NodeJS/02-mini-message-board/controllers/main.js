export const messages = [
    {
      text: "Hi there!",
      user: "Amando",
      added: new Date()
    },
    {
      text: "Hello World!",
      user: "Charles",
      added: new Date()
    }
  ];

  export function addMessage(message){
    messages.push({
        text:message.text,
        user:message.user,
        added: new Date()
    })
  }

  export function itemsLink(id){
    return '/item/' + id
  }