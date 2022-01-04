import styles from "./Breadcrumb.module.css";
import { Link } from "react-router-dom";

export default function Breadcrumb({ uriSegments }) {
  return (
    <div className={styles.breadcrumbContainer}>
      Nav:
      {uriSegments.map((uri, index) => {
        const capitalisedUri = uri[0].toUpperCase() + uri.slice(1);
        let crumbs = [];
        if (uriSegments.length === 1 && index === 0) {
          crumbs.push(<div key={index}>{capitalisedUri}</div>);
        } else if (uri === "home" || uri === "/") {
          // then it is the first item route to the app homepage
          crumbs.push(
            <Link key={index} to={"/"}>
              {capitalisedUri}
            </Link>
          );
        } else if (index === uriSegments.length - 1) {
          // then it is the last item
          crumbs.push(<div key={index}>{capitalisedUri}</div>);
        } else {
          crumbs.push(
            <Link key={index} to={"/" + uri}>
              {capitalisedUri}
            </Link>
          );
        }

        if (index !== uriSegments.length - 1) {
          // then it is the last item
          crumbs.push(<div key={index + ">"}>{">"}</div>);
        }

        return crumbs;
      })}
    </div>
  );
}

export const BreadcrumbIndicies = {
  home: "home",
  mileage: "mileage",
  reports: "reports",
  cars: "cars",
  oil: "oil",
  add: "add",
  edit: "edit",
};
