import styles from "./Breadcrumb.module.css";
import { Link } from "react-router-dom";

export default function Breadcrumb({ uriSegments }) {
  return (
    <div className={styles.breadcrumbContainer}>
      {uriSegments.map((uri, index) => {
        if (uri === "home" || uri === "/") {
          // then it is the first item route to the app homepage
          return (
            <Link key={index} to={"/"}>
              {uri}
            </Link>
          );
        } else if (index === uriSegments.length - 1) {
          // then it is the last item
          return <div key={index}>last item</div>;
        }
        return (
          <Link key={index} to={"/" + uri}>
            {uri}
          </Link>
        );
      })}
    </div>
  );
}
