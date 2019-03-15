/*
Copyright 2016-2017 Balena

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import BalenaSdk = require('balena-sdk');
import * as ResinDeviceStatus from 'resin-device-status';

const hasProgress = (progress: number | void): boolean =>
	!!progress && progress < 100;

const isUpdating = (device: BalenaSdk.Device): boolean => {
	const status = ResinDeviceStatus.getStatus(device).key;
	return (
		hasProgress(device.download_progress) &&
		status === ResinDeviceStatus.status.UPDATING
	);
};

const isProvisioning = (device: BalenaSdk.Device): boolean => {
	const status = ResinDeviceStatus.getStatus(device).key;
	return (
		hasProgress(device.provisioning_progress) &&
		(status === ResinDeviceStatus.status.CONFIGURING ||
			status === ResinDeviceStatus.status.POST_PROVISIONING)
	);
};

export const getDeviceOsProgress = (device: BalenaSdk.Device) => {
	if (!device.is_online) {
		return 0;
	}

	if (isUpdating(device)) {
		return device.download_progress || 0;
	}
	if (isProvisioning(device)) {
		return device.provisioning_progress || 0;
	}

	return 0;
};
