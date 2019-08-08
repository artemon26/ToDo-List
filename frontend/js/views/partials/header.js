import Component from '../../views/component';

import HeaderTemplate from '../../../templates/partials/header';

class Header extends Component {
    render() {
        const resource = this.request.resource;

        return new Promise(resolve => resolve(HeaderTemplate({
            isAboutPage: !resource,
            isTasksPage: (resource === 'tasks')
        })));
    }
}

export default Header;