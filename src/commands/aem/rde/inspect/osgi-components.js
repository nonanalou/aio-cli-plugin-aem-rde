/*
 * Copyright 2022 Adobe Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
'use strict';

const { BaseCommand, cli, commonFlags } = require('../../../../lib/base-command');

class OsgiComponentsCommand extends BaseCommand {
  async run() {
    const { args, flags } = await this.parse(OsgiComponentsCommand);
    try {
      if (!args.name) {
        let params = {};
        params.scope = flags.scope;
        params.filter = flags.include;

        let response = await this.withCloudSdk((cloudSdkAPI) =>
          cloudSdkAPI.getOsgiComponents(flags.target, params)
        );
        if (response.status === 200) {
          let json = await response.json();
          cli.log('- Osgi Components: ');
          json.items.forEach((osgiComponent) => {
            cli.log(osgiComponent);
          });
        } else {
          cli.log(`Error: ${response.status} - ${response.statusText}`);
        }
      } else {
        let response = await this.withCloudSdk((cloudSdkAPI) =>
          cloudSdkAPI.getOsgiComponent(flags.target, args.name)
        );
        if (response.status === 200) {
          let osgiComponent = await response.json();
          cli.log(`- Osgi Component "${args.name}": `);
          cli.log(osgiComponent);
        } else {
          cli.log(`Error: ${response.status} - ${response.statusText}`);
        }
      }
    } catch (err) {
      cli.log(err);
    }
  }
}

Object.assign(OsgiComponentsCommand, {
  description:
    'Get the list of osgi-components for the target of a rapid development environment.',
  args: [
    {
      name: 'name',
      description: 'The name of the osgi-component to get.',
    },
  ],
  flags: {
    target: commonFlags.target,
    scope: commonFlags.scope,
    include: commonFlags.include,
  },
});

module.exports = OsgiComponentsCommand;
