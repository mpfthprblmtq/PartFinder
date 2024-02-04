import {FunctionComponent} from "react";
import {Route, Routes} from "react-router-dom";
import PartFinder from "../components/PartFinder/PartFinder";

const AppRouter: FunctionComponent = () => {
    return (
        <Routes>
            {/*<Route path={'/'}>*/}
            {/*    <Route path='' element={<PartFinder />} />*/}
            {/*    <Route path=':urlId' element={<PartFinder />} />*/}
            {/*</Route>*/}

            {/*<Route path='/' element={<PartFinder />} />*/}

            <Route path='/'>
                <Route path={'/'} element={<PartFinder />} />
                <Route path={'/:urlId'} element={<PartFinder />} />
            </Route>
        </Routes>
    );
}

export default AppRouter;