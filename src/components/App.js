import React, { useEffect } from 'react';
import { useState } from 'react';
import Header from './Header.js';
import Main from './Main.js';
import Footer from './Footer.js';
import { api } from '../utils/api.js';
import { UserContext } from '../contexts/CurrentUserContext.js';
import PopupWithForm from './PopupWithForm.js';
import ImagePopup from './ImagePopup.js';
import EditProfilePopup from './EditProfilePopup.js';
import EditAvatarPopup from './EditAvatarPopup.js';
import AddPlacePopup from './AddPlacePopup.js';
import { AppContext } from '../contexts/CurrentAppContext.js';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({}); //хук состояния. нужен для изменения состояния компонента
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    Promise.all([api.getUserInfo(), api.getInitialCards()])
      // тут деструктурируете ответ от сервера, чтобы было понятнее, что пришло
      .then(([userData, cards]) => {
        // тут установка данных пользователя
        // и тут отрисовка карточек
        setCurrentUser(userData);
        setCards(cards);
      })
      .catch(console.error);
  }, []);

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleConfirmationClick() {
    setIsConfirmationPopupOpen(true);
  }

  const isOpen =
    isEditAvatarPopupOpen ||
    isEditProfilePopupOpen ||
    isAddPlacePopupOpen ||
    selectedCard;

  useEffect(() => {
    function closeByEscape(evt) {
      if (evt.key === 'Escape') {
        closeAllPopups();
      }
    }
    if (isOpen) {
      // навешиваем только при открытии
      document.addEventListener('keydown', closeByEscape);
      return () => {
        document.removeEventListener('keydown', closeByEscape);
      };
    }
  }, [isOpen]);

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsConfirmationPopupOpen(false);
    setSelectedCard(null);
  }

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => {
          return state.map((c) => (c._id === card._id ? newCard : c));
        });
      })
      .catch(console.error);
  }

  function handleCardDelete(card) {
    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((item) => item._id !== card._id));
      })
      .catch(console.error);
  }

  function handleUpdateUser(name, about) {
    setIsLoading(true);
    api
      .editUserInfo(name, about)
      .then((result) => {
        // console.log(result);
        setCurrentUser(result);
        closeAllPopups();
      })
      .catch(console.error)
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleAvatar(link) {
    setIsLoading(true);
    api
      .changeAvatar(link)
      .then((result) => {
        // console.log(result);
        setCurrentUser(result);
        closeAllPopups();
      })
      .catch(console.error)
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleAddPlaceSubmit(name, link) {
    setIsLoading(true);
    api
      .postCard(name, link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch(console.error)
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div className="root">
      {/* Создали провайдер для передачи контекста в лежащие внутри компоненты */}
      {/* Передали в значение текущий стейт и изменение его состояния */}
      <AppContext.Provider value={{ isLoading, closeAllPopups }}>
        <UserContext.Provider value={{ currentUser, setCurrentUser }}>
          <div className="page">
            <Header />
            <Main
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              setCards={setCards}
              cards={cards}
              onCardDelete={handleCardDelete}
            />
            <Footer />
            {/* ----------------------------------------------------- */}
            <EditProfilePopup
              isOpen={isEditProfilePopupOpen}
              onUpdateUser={handleUpdateUser}
            />
            {/* -------------------------------------------------------- */}
            <AddPlacePopup
              isOpen={isAddPlacePopupOpen}
              onSubmit={handleAddPlaceSubmit}
            ></AddPlacePopup>
            {/* ---------------------------------------------------------- */}
            <ImagePopup card={selectedCard}></ImagePopup>
            {/* --------------------------------------------------------------- */}
            <EditAvatarPopup
              isOpen={isEditAvatarPopupOpen}
              onSubmit={handleAvatar}
            />
            {/* ----------------------------------------------------- */}
            <PopupWithForm
              title="Вы уверены?"
              name="confirmation"
              isOpen={isConfirmationPopupOpen}
              onClose={closeAllPopups}
            ></PopupWithForm>
          </div>
        </UserContext.Provider>
      </AppContext.Provider>
    </div>
  );
}

export default App;
