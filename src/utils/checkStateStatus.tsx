import {Status} from "../constants/enums.ts";
import {Spin} from "antd";

export const renderStatus = (status: string, error: string | null) => {
    switch (status) {
        case Status.LOADING:
            return (
                <Spin
                    size="large"
                    style={{
                        height: "100vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                />
            );

        case Status.FAILED:
            return (
                <p style={{color: "red", textAlign: "center"}}>
                    {error}
                </p>
            );

        default:
            return null;
    }
}
