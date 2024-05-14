import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";

export const withRouter = (Component) => {
  const Wrapper = (props) => {
    const history = useNavigate();

    return <Component history={history} {...props} params={useParams()} />;
  };
  return Wrapper;
};
