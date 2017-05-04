import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records";

// Your retrieve function plus any additional functions go here ...
const isPrimary = color => {
  const primaryColors = ['red', 'blue', 'yellow'];
  return primaryColors.includes(color);
}

const retrieve = ({
  page: page = 1,
  colors
} = {
  page: 1,
  colors: []
}) => {

  const offset = (page * 10) - 10;

  const uri = URI(window.path).query({
    limit: 11,
    offset,
    'color[]': colors
  });

  return fetch(uri)
    .then(response => response.json())
    .then(items => {

      const pageItems = items.slice(0, 10);
      const previousPage = page === 1 ? null : (page - 1);
      const nextPage = items.length === 11 ? (page + 1) : null;
      const ids = pageItems.map(item => item.id);
      const open = pageItems.filter(item => item.disposition === 'open');

      open.forEach(item => {
        item.isPrimary = isPrimary(item.color);
      });

      const closedPrimaryCount = pageItems.filter(({ disposition, color }) => {
        return disposition === 'closed' && isPrimary(color);
      }).length;

      return {
        previousPage,
        nextPage,
        ids,
        open,
        closedPrimaryCount
      }
    })
    .catch(console.log);

}

export default retrieve;
