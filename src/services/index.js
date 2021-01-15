import {
  onNavigate
} from "../../utils/history.js"

const auth = firebase.auth()

export const loginPrincipal = (email, senha) => {
  auth.signInWithEmailAndPassword(email, senha)
    .then(() => {
      onNavigate('/feed');
      const user = auth.currentUser;
      alert(`Bem-vindo ao Olimpo, ${user.displayName}!`);
    })
    .catch((error) => {
      const errorMessage = error.message;
      alert(`${errorMessage}`);
    });
};

export const loginGoogle = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then(() => {
      onNavigate('/feed');
      alert(`Bem-vindo ao Olimpo, ${auth.currentUser.displayName}!`);
      const user = auth.currentUser;
      const uid = user.uid
      firebase.firestore().doc(`/users/${uid}`).set({
        email: user.email,
        name: user.displayName,
      });
    })
    .catch((error) => {
      const errorMessage = error.message;
      alert(`${errorMessage}`);
    });
};

export const newRegistry = (email, senha, nameUser) => {
  auth.createUserWithEmailAndPassword(email, senha)
    .then(() => {
      const user = auth.currentUser;

      user.updateProfile({
        displayName: nameUser,

      }).then(function () {
        alert(`${user.displayName} sua conta foi criada com sucesso!`);
        onNavigate('/login');

        const uid = user.uid
        firebase.firestore().doc(`/users/${uid}`).set({
          email: user.email,
          name: nameUser,
        })
      })
    })
    .catch((error) => {
      const errorMessage = error.message;
      alert(`${errorMessage}`);
    });
};

export const Navigation = () => {
  const navigation = document.createElement('nav');
  navigation.classList.add('navigation')
  navigation.innerHTML = `
   <ul class="navMenu">
     <li><img src="images/fireHome.png"  id="feed" class="menu-icon"></li>
     <li><img src="images/bell.png"  id="notification" class="menu-icon"></li>
     <li><img src="images/email.png" id="message" class="menu-icon"></li>
     <li><img src="images/profile.png" id="profile" class="menu-icon"></li>
     <li><img src="images/off.png" id="out" class="menu-icon logOut"></li>
   </ul>
  `;

  const bottunNotification = navigation.querySelector('#notification');
  bottunNotification.addEventListener('click', () => {
    onNavigate('/notification');

  });

  const bottunPorfile = navigation.querySelector('#profile');
  bottunPorfile.addEventListener('click', () => {
    onNavigate('/profile');
  });

  const bottunMessage = navigation.querySelector('#message');
  bottunMessage.addEventListener('click', () => {
    onNavigate('/message');
  });

  const bottunFeed = navigation.querySelector('#feed');
  bottunFeed.addEventListener('click', () => {
    onNavigate('/feed');
  });

  const bottunSingOut = navigation.querySelector('#out');
  bottunSingOut.addEventListener('click', () => {
    auth.signOut().then(function () {
      onNavigate('/');
    }).catch(function (error) {
      console.log(error)
    });
  });

  return navigation;
};

export const newPost = (saveTextPost) => {

  const user = firebase.auth().currentUser;
  const docFirestore = firebase.firestore();

  docFirestore.collection(`post`).add({
    name: user.displayName,
    text: saveTextPost,
    date: (new Date()).toLocaleString(),
    uid: user.uid,
    like: [],
    comment: [],

  }).catch(() => {
    alert("Não foi possível publicar, tente novamente.")
  })
};

export const post = (name, date, text, like, id, userIdPost) => {
  const post = document.createElement('div');
  post.innerHTML = `
     <p class="nameUser">${name}</p>
     <p class="textUser">${text}</p>
     <p class="dateUser">${date}</p>
     <p class="likeUser">${like.length}</p>
     <button class="like">curtir</button>
     <button class="edit">editar</button>
     <button class="delet">apagar</button>
    `;
  const editButton = post.querySelectorAll('.edit');
  const likePost = post.querySelectorAll(".like");
  likePost.forEach((button) => {
    button.addEventListener("click", (e) => {

      const boxPost = e.target.parentNode
      const likeUsers = boxPost.querySelector(".likeUser")
      const user = firebase.auth().currentUser.displayName;
      const docs = firebase.firestore().collection("post").doc(id);

      like.push(user)

      docs.update({
          like
        })
        .then(function () {
          likeUsers.innerHTML = like
        })
    })
  })
  editButton.forEach((button) => {
    button.addEventListener('click', (e) => {
      const boxPost = e.target.parentNode
      const texto = boxPost.querySelector(".textUser");
      const data = boxPost.querySelector(".dateUser");
      const paramText = text;
      texto.innerHTML = `<textarea class="textPost">${paramText}</textarea>
      <button class="editPost">Editar</button>`
      const editSend = texto.querySelector(".editPost");
      editSend.addEventListener('click', () => {
        const textNew = texto.querySelector(".textPost");
        const textValue = textNew.value;
        const docsEditar = firebase.firestore().collection("post").doc(id);

        docsEditar.update({
          text: textValue,
          date: (new Date()).toLocaleString(),
        }).then(function () {
          docsEditar.onSnapshot(function (doc) {
            texto.innerHTML = doc.data().text,
              data.innerHTML = doc.data().date
          })
        });
      });
    });
  });
  return post;
};
  const boxPost = e.target.parentNode;
  const likeUsers = boxPost.querySelector(".likeUser");
  const uid = firebase.auth().currentUser.uid
  likePosts(likeUsers, id, like, uid)

    })
  })
  const deletPost = post.querySelectorAll(".delet");
  deletPost.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.target.parentNode;
      deletPosts(userIdPost,id);
    })
  })

  return post;
}

export const deletPosts = (userIdPost,id) => {

  const docs = firebase.firestore().collection("post").doc(id)
  const uid = firebase.auth().currentUser.uid
  
  if (userIdPost === uid) {
    window.confirm("Você deseja apagar essa publicação?")
    docs.delete().then(function () {
      getPosts()
    }).catch(function (error) {
      console.error("Não foi possivel excluir", error);
    });
  } else {
    alert("Não é possivel excluir post de outros usuarios")
  }
}

export const likePosts = (likeUsers, id, like, uid) => {
  const docs = firebase.firestore().collection("post").doc(id);

  if (like.includes(uid)) {
    let indice = like.indexOf(uid);
    while (indice >= 0) {
      like.splice(indice, 1);
      indice = like.indexOf(uid)
    }
    docs.update({
      like
    }).then(function () {
      docs.onSnapshot(function (doc) {
        likeUsers.innerHTML = doc.data().like.length
      })
    })
  } else {
    like.push(uid)
    docs.update({
      like
    }).then(function () {
      docs.onSnapshot(function (doc) {
        likeUsers.innerHTML = doc.data().like.length
      })
    })
  }
}
export const getPosts = () => {

  firebase.firestore().collection("post").orderBy('date', 'desc')
    .get()
    .then(function (querySnapshot) {
      feedPost.innerHTML = ``
      textPost.value = "";
      querySnapshot.forEach(function (doc) {
        const id = doc.id;
        const userIdPost = doc.data().uid;
        const name = doc.data().name;
        const text = doc.data().text;
        const date = doc.data().date;
        const like = doc.data().like;
        feedPost.appendChild(post(name, date, text, like, id, userIdPost));

      });
    });
};