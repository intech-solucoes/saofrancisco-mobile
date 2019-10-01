import React from "react";
import { Text } from "react-native";
import { Grid, Row, Col } from "native-base";
import { NavigationScreenProp, ScrollView } from "react-navigation";
import { Loader, Box } from "../../components";
import Styles, { Variables } from "../../styles";

interface Props { 
    navigation: NavigationScreenProp<any, any>;
}

interface State {
    loading: boolean;
    mensagem: any;
}

export class MensagemDetalhe extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            mensagem: null,
            loading: false
        }
    }

    componentDidMount = async () => {
        var mensagem = JSON.parse(this.props.navigation.getParam("mensagem", "{}"));
        await this.setState({ mensagem });
    }

    render() {
        return (
            
            <ScrollView style={Styles.scrollContainer} contentContainerStyle={Styles.scrollContainerContent}>
                <Loader loading={this.state.loading} {...this.props} />
                
                {this.state.mensagem &&
                    <Box titulo={this.state.mensagem.TXT_TITULO}>
                        <Grid>
                            <Row>
                                <Col>
                                    <Text>Data: {this.state.mensagem.DTA_MENSAGEM}</Text>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 10 }}>
                                <Col>
                                    <Text>{this.state.mensagem.TXT_CORPO}</Text>
                                </Col>
                            </Row>
                        </Grid>
                    </Box>
                }
            </ScrollView>
        );
    }
}