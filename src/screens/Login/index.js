import React from "react";
import { Text, View, TextInput, Switch, AsyncStorage } from "react-native";
import VersionNumber from "react-native-version-number";
import Icon from "react-native-vector-icons/FontAwesome5";
import TouchID from "react-native-touch-id";

import Styles, { Variables } from "../../styles";
import { Button, Loader, Alert } from "../../components";
import Container from "./container";
import loginStyles from "./styles";

import {
  UsuarioService,
  FuncionarioService,
  PlanoService
} from "@intechprev/prevsystem-service";

export default class Login extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    // Armazena as referências dos inputs para fácil transição entre eles, como utilizar o tab no teclado
    this.inputs = {};

    // Cria o state do componente
    this.state = {
      //cpf: "12178513727",
      //cpf: "11817235745",
      //senha: "123",
      cpf: "",
      senha: "",
      lembrar: false,
      loading: false,
      modalVisible: false,
      touchIDAvailable: false,
      loginVisible: true,
      w: "auto",
      h: "auto",
      leitorDigital: false,
      digitalAccess: false,
    };

    this.alerta = React.createRef();
  }

  async componentDidMount() {
    await this.setState({ loading: false });

    var cpf = await AsyncStorage.getItem("cpfSalvo");
    var digitalAccess = await AsyncStorage.getItem('digitalAccess');

    if (cpf) await this.setState({ cpf, lembrar: true });

    if (!digitalAccess) {
      AsyncStorage.setItem('digitalAccess', 'false')
    }

    if (digitalAccess == 'true') {
      await this.setState({ digitalAccess, leitorDigital: true });
    }


    try {
      var biometryType = await TouchID.isSupported();

      if (biometryType === 'TouchID') {
        // Touch ID is supported on iOS
        //alert("TouchID"); 
      } else if (biometryType === 'FaceID') {
        // Face ID is supported on iOS
        //alert("FaceID");
      } else if (biometryType === true) {
        // Touch ID is supported on Android
        //alert("Android");
      }

      await this.setState({ touchIDAvailable: true });

    } catch (err) {
      if (err.name === "Touch ID Error") {
        await this.setState({ touchIDAvailable: false });
      } else {
        alert("Ocorreu um erro");
      }
    }



  }

  focusNextField = id => {
    this.inputs[id].focus();
  };

  fingerLogin = () => {
    try {
      TouchID.authenticate('Use sua digital para se autenticar').then(success =>
        this.props.navigation.navigate('Planos')
      )
        .catch(() => {
          this.setState({ digitalAccess: false })
        })
    } catch (err) {
      console.log(err);
    }
  }

  firstAccess = async () => {
    this.props.navigation.navigate("PrimeiroAcesso");
  };

  login = async () => {
    this.setState({
      modalVisible: true
    });

    try {
      await this.setState({ loading: true });

      if (this.state.lembrar) {
        await AsyncStorage.setItem("cpfSalvo", this.state.cpf);
      }


      if (this.state.leitorDigital && this.state.digitalAccess) {
        this.fingerLogin();
      }
      else {
        var { data: login } = await UsuarioService.Login(this.state.cpf, this.state.senha);

        await AsyncStorage.setItem("pensionista", login.Pensionista.toString());
        await AsyncStorage.setItem("token", login.AccessToken);

        var { data: funcionarioData } = await FuncionarioService.Buscar();

        await AsyncStorage.setItem("fundacao", funcionarioData.Funcionario.CD_FUNDACAO);
        await AsyncStorage.setItem("empresa", funcionarioData.Funcionario.CD_EMPRESA);

        var { data: planos } = await PlanoService.Buscar();
        if (planos.length > 1) this.props.navigation.navigate("Planos");
        else {
          var plano = planos[0];
          await AsyncStorage.setItem("plano", plano.CD_PLANO.toString());
          await AsyncStorage.setItem("assistido", (plano.DS_CATEGORIA === "ASSISTIDO").toString());
          this.props.navigation.navigate("Home");
        }
      }


    } catch (ex) {
      if (ex.response) {
        await this.setState({ loading: false });
        await this.alerta.current.mostrar(ex.response.data);
      } else {
        await this.setState({ loading: false });
        await this.alerta.current.mostrar("Ocorreu um erro ao processar requisição!");
        console.warn(ex);
      }
    } finally {
      await this.setState({ loading: false });
    }
  };

  render() {
    return (
      <Container subtitulo={"Bem vindo ao aplicativo da São Francisco"}>
        <View style={loginStyles.content}>
          <Loader loading={this.state.loading} />
          <Alert ref={this.alerta} />

          <Text style={loginStyles.label}>CPF</Text>
          <TextInput name={"cpf"} style={Styles.textInput} placeholder="Digite aqui seu CPF" returnKeyType="next" blurOnSubmit={false} underlineColorAndroid="transparent"
            value={this.state.cpf}
            onSubmitEditing={() => { this.focusNextField('senha'); }} onChangeText={value => this.setState({ cpf: value })}
            ref={input => { this.inputs['cpf'] = input; }} />

          {this.state.digitalAccess == false &&
            <Text style={loginStyles.label}>Senha</Text>
          }
          {this.state.digitalAccess == false &&
            <TextInput name={"senha"} style={Styles.textInput} placeholder="Digite aqui sua senha" returnKeyType="done" secureTextEntry={true}
              value={this.state.senha}
              ref={input => { this.inputs['senha'] = input; }} onChangeText={value => this.setState({ senha: value })} />
          }
          <View style={{ flexDirection: "row", marginVertical: 10 }}>
            {/* <View style={{ width: 40 }}>
              {this.state.touchIDAvailable &&
                <Button style={loginStyles.loginFingerprint} onClick={this.fingerLogin}>
                  <Icon name={"fingerprint"} style={{ marginRight: 0 }} size={28} color={"#FFF"} borderRadius={10} />
                </Button>
              }
            </View> */}

            <View style={{ flex: 1, flexDirection: "row", justifyContent: 'flex-end' }}>
              <Text style={loginStyles.labelRemeber}>Lembrar-me</Text>
              <Switch value={this.state.lembrar} thumbColor={Variables.colors.primary}
                onValueChange={value => this.setState({ lembrar: value })} />
            </View>

          </View>

          <View>
            <Button title="Entrar" onClick={this.login} style={loginStyles.loginButton} />
            <Button title="Primeiro Acesso/Esqueci minha senha" onClick={this.firstAccess} light={true}
              style={{ backgroundColor: "transparent", marginTop: 5 }} titleStyle={[Styles.buttonLight, { fontSize: 14, color: Variables.colors.secondary }]} />
          </View>

        </View>

        <Text style={{ marginBottom: 10, padding: 5, textAlign: "center", color: "#8F8E93" }}>
          Versão {VersionNumber.appVersion}
        </Text>
      </Container>
    );
  }
}
