const logoutBtn = new LogoutButton();

logoutBtn.action = () => {
    const cb =(response) => {
      if (response.success) {
        location.reload();
      }
    }

    ApiConnector.logout(cb);
}

ApiConnector.current((response) => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    }
});

const ratesBoard = new RatesBoard();

const updateRatesBoard = () => {
    ApiConnector.getStocks((response) => {
        if (response.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
        }
    });
}

updateRatesBoard();

setInterval(() => {
    updateRatesBoard();
}, 60000);

const moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = (data) => {
    const { currency, amount } = data;
    const cb = (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(response.success, "Баланс пополнен.");
          } else {
            moneyManager.setMessage(response.success, response.error);
          }
    }

    ApiConnector.addMoney({ currency, amount }, cb);
}

moneyManager.conversionMoneyCallback = (data) => {
    const { fromCurrency, targetCurrency, fromAmount } = data;
    const cb = (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(response.success, "Конвертация выполнена.");
          } else {
            moneyManager.setMessage(response.success, response.error);
          }
    }
    ApiConnector.convertMoney({ fromCurrency, targetCurrency, fromAmount }, cb);
}

moneyManager.sendMoneyCallback = (data) => {
    const { to, currency, amount } = data;
    const cb = (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(response.success, "Перевод выполнен.");
          } else {
            moneyManager.setMessage(response.success, response.error);
          }
        }
    ApiConnector.transferMoney({ to, currency, amount }, cb);
}

const favoritesWidget = new FavoritesWidget();

const updateFavoritesWidget = () =>{
    ApiConnector.getFavorites((response) => {
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
        }
    });
}

updateFavoritesWidget();

favoritesWidget.addUserCallback = (data) => {
    const {id, name} = data;
    const cb = (response) => {
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(response.success, "Пользователь добавлен.");
        } else {
            favoritesWidget.setMessage(response.success, response.error);
          }
        }
    ApiConnector.addUserToFavorites({id, name}, cb);
}

favoritesWidget.removeUserCallback = (data) => {
    const id = data;
    const cb = (response) => {
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(response.success, "Пользователь удален.");
        } else {
            favoritesWidget.setMessage(response.success, response.error);
          }
        }

    ApiConnector.removeUserFromFavorites(id, cb);
}