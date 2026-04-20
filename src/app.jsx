/* global React, HomePage, StudiesPage, StudyDetailPage, ConditionsPage,
   ConditionDetailPage, LocationsPage, LocationDetailPage, ForCliniciansPage,
   ReferPage, FAQPage, NotFound, ScrollProgress, Nav, Footer, TweaksPanel */
const { useState, useEffect } = React;

function parseHash() {
  const h = window.location.hash.replace(/^#\/?/, "") || "";
  const parts = h.split("/").filter(Boolean);
  return { parts, hash: "#/" + parts.join("/") };
}

function App() {
  const [route, setRoute] = useState(parseHash());
  useEffect(() => {
    const on = () => {
      setRoute(parseHash());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);

  const [p0, p1] = route.parts;
  let page, current = "#/";
  if (!p0) { page = <HomePage/>; current = "#/"; }
  else if (p0 === "studies" && !p1) { page = <StudiesPage/>; current = "#/studies"; }
  else if (p0 === "studies" && p1) { page = <StudyDetailPage nctId={p1}/>; current = "#/studies"; }
  else if (p0 === "conditions" && !p1) { page = <ConditionsPage/>; current = "#/conditions"; }
  else if (p0 === "conditions" && p1) { page = <ConditionDetailPage slug={p1}/>; current = "#/conditions"; }
  else if (p0 === "locations" && !p1) { page = <LocationsPage/>; current = "#/locations"; }
  else if (p0 === "locations" && p1) { page = <LocationDetailPage slug={p1}/>; current = "#/locations"; }
  else if (p0 === "for-clinicians") { page = <ForCliniciansPage/>; current = "#/for-clinicians"; }
  else if (p0 === "refer") { page = <ReferPage/>; current = "#/refer"; }
  else if (p0 === "faq") { page = <FAQPage/>; current = "#/faq"; }
  else page = <NotFound/>;

  return (
    <>
      <ScrollProgress/>
      <Nav current={current}/>
      <main>{page}</main>
      <Footer/>
      <TweaksPanel/>
    </>
  );
}

window.App = App;
