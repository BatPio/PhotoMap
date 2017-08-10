'use strict'

/**
 * PhotoMap
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Piotr Bator <prbator@gmail.com>
 * @copyright Piotr Bator 2017
 */

import React,{ PropTypes } from 'react';
import ReactDom from 'react-dom';

export default class FoldersList extends React.Component {

    static propTypes = {
        list: PropTypes.array.isRequired,
        componentClassName: PropTypes.string,
        onItemsNeededFunc: PropTypes.func,
    };

    constructor(props) {
        super(props);
        let initialItemsState = {};
        console.log(props.list);
        props.list.forEach(function(element) {
            initialItemsState[element.id]= {
                isOpened: false,
            };
        });
        this.state= {
            itemsState: initialItemsState
        };
    }
      
    handleToggle (headerIndex) {
        let newData = Object.assign({}, this.state.itemsState)
        newData[headerIndex].isOpened = !newData[headerIndex].isOpened
        this.setState(
        newData
        )
        console.log(this.props.onItemsNeededFunc);
    }

    renderFiles(folderId, filesList, itemState) {
        if (!itemState.isOpened) {
            return;
        }
        if (!filesList && this.props.onItemsNeededFunc) {
            this.props.onItemsNeededFunc(folderId);
            return;
        }
        const itemsList = filesList.map((file) =>
        <img ref="item" className="folder-item" src={file.thumb}/>
        );
        return(<div className="items-list">{itemsList}</div>);
    }

    render() {
        const listItems = this.props.list.map((folder, headerIndex) => {
            let itemState = this.state.itemsState[folder.id];
            let headerClass = "collapsible" + ((itemState.isOpened && folder.filesList) ? " open" : "");
             return (
            <li className={headerClass}>
                <button className="collapse" onClick={this.handleToggle.bind(this, folder.id)}></button>
                <a href="#" className="icon-folder svg" onClick={this.handleToggle.bind(this, folder.id)}>{folder.label}</a>
                <a href={folder.link} className="folder-link"><span className="icon icon-picture svg"/></a>
                {this.renderFiles(folder.id, folder.filesList, itemState)}
            </li>);
        });
        let componentClassName = this.props.componentClassName || "list-component";
        return (
            <ul className="with-icon">{listItems}</ul>
        );
    }

}