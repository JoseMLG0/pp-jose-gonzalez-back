import Server from "./config/server";

const mainServer = new Server();

mainServer.getApp().listen(process.env.PORT || 5560, () => {
    console.log('Aplicacion iniciada');
})