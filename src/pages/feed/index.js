import {
  Navigation
} from "/services/index.js"

export const Feed = () => {
const nav = Navigation();

const rootElement = document.createElement('div');
rootElement.appendChild(nav);

const content = () => {
  const contentElement = document.createElement('div');
  contentElement.innerHTML = `
    <h1>Post</h1>
    <form>
      <textarea name="" id="textPost" cols="70" rows="5" placeholder="escreva aqui..."></textarea>
      <button id="creatPost" >Post</button>
    </form>
    <div>
      <p id="outputPost"></p>
    </div>
    `;
  return contentElement;
};
rootElement.appendChild(content());

const textPost = rootElement.querySelector("#textPost");
const creatPost = rootElement.querySelector("#creatPost");

const outputPost = rootElement.querySelector("#outputPost");

creatPost.addEventListener("click", (event) => {
  event.preventDefault();
  const saveTextPost = textPost.value;

  const user = firebase.auth().currentUser;
  const docFirestore = firebase.firestore();

  docFirestore.collection(`post`).add({
    name: user.displayName,
    text: saveTextPost,
    date: (new Date()).toLocaleString(),
    uid: user.uid,
  })

//   const uid = user.uid
//   const docFirestore = firebase.firestore();
//   const docRef = docFirestore.doc(`/post/${uid}`);

//   docRef.set({
//     name: user.displayName,
//     text: saveTextPost,  
//     date: (new Date()).toLocaleString(),
// }).then(() => {
//   docRef.get().then(function (doc) {
//     if (doc && doc.exists) {
//       const myData = doc.data();
//       outputPost.innerHTML = `${myData.text} <br> ${myData.date} <br> ${ myData.name}`;
//     }
//   }).cath((error) => {
//     console.log("oh no!", error)
//   })
// })

});

return rootElement;
};